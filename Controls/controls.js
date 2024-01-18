import Person from "../Models/PersonModel.js";
import bcrypt from "bcrypt";
import { v4 as uuidv4 } from "uuid";

// SignUp
export const SignUp = async (req, res) => {
  try {
    console.log(req.body);
    const existingPerson = await Person.findOne({ rollNo: req.body.rollNo });
    if (existingPerson) {
      res.status(409).json({ message: "User already exists" });
    }
    delete req.body.confirmPassword;
    req.body.password = await bcrypt.hash(req.body.password, 12);
    const newPerson = await Person.create(req.body);
    res.status(200).json({ user: newPerson });
  } catch (error) {
    res.status(500).json({ error: "Something went wrong" });
  }
};

// SignIn
export const SignIn = async (req, res) => {
  try {
    const existingPerson = await Person.findOne({ rollNo: req.body.rollNo });
    if (existingPerson) {
      const bool = await bcrypt.compare(
        req.body.password,
        existingPerson.password
      );
      if (bool) res.status(200).json({ user: existingPerson });
      else res.status(401).json({ message: "Unauthorized access" });
    } else res.status(404).json({ message: "user not found" });
  } catch (error) {
    res.status(500).json({ error: "Something went wrong" });
  }
};

// Get a person
export const GetPerson = async (req, res) => {
  try {
    const person = await Person.findById(req.params.id);
    if (person) res.status(200).json({ user: person });
    else res.status(404).json({ message: "user not found" });
  } catch (error) {
    res.status(500).json({ error: "Something went wrong" });
  }
};

// Get all users
export const GetAllUsers = async (req, res) => {
  try {
    const persons = await Person.find();
    res.status(200).json({ users: persons });
  } catch (error) {
    res.status(500).json({ error: "Something went wrong" });
  }
};

// Get all faculty
export const GetFac = async (req, res) => {
  try {
    const persons = await Person.find({ role: "staff" });
    res.status(200).json({ users: persons });
  } catch (error) {
    res.status(500).json({ error: "Something went wrong" });
  }
};

// Delete a user
export const deleteUser = async (req, res) => {
  try {
    const person = await Person.findByIdAndDelete(req.params.id);
    if (person) {
      res.status(200).json({ message: "User deleted successfully" });
    } else {
      res.status(404).json({ message: "User not found" });
    }
  } catch (error) {
    res.status(500).json({ message: "Something went wrong" });
  }
};

// Update a user
export const updateUser = async (req, res) => {
  try {
    req.body.password = await bcrypt.hash(req.body.password, 12);
    const person = await Person.findByIdAndUpdate(req.params.id, req.body);
    if (person) {
      res.status(200).json({ message: "User updated successfully" });
    } else {
      res.status(404).json({ message: "User not found" });
    }
  } catch (error) {
    res.status(500).json({ message: "Something went wrong" });
  }
};

// Permission System
export const permissionReq = async (req, res) => {
  try {
    const { request, rollNo } = req.body;
    const receiver = request.receiver;
    console.log(req.body, receiver, rollNo);
    const person = await Person.findOne({ rollNo: rollNo });
    request.id = uuidv4();
    request.status = "pending";
    person.permissionRecords.push(request);
    await person.save();
    const user = await Person.findById(receiver);

    if (user.role !== "staff")
      res.status(403).json({ message: "Receiver is not a staff member" });

    user.permissionRequests.push(request);

    await user.save();
    res.status(200).json({ message: "Permission requested" });
  } catch (error) {
    res.status(500).json({ message: "Something went wrong" });
  }
};

// Granted Permission
export const grantedPermission = async (req, res) => {
  try {
    const { id, sender, receiver } = req.body;
    const sendingPerson = await Person.findById(sender);
    const user = await Person.findById(receiver);
    sendingPerson.permissionRecords = sendingPerson.permissionRecords.filter(
      (record) => {
        return record.id !== id;
      }
    );
    req.body.status = "granted";
    sendingPerson.permissionRecords.push(req.body);
    await sendingPerson.save();

    user.permissionRequests = user.permissionRequests.filter((record) => {
      return record.id !== id;
    });
    user.permissionRequests.push(req.body);
    await user.save();

    res.status(200).json({ data: sendingPerson.permissionRecords });
  } catch (error) {
    res.status(500).json({ error: "Something went wrong" });
  }
};

// Rejected Permission
export const rejectedPermission = async (req, res) => {
  try {
    const { id, sender, receiver } = req.body;
    const sendingPerson = await Person.findById(sender);
    const user = await Person.findById(receiver);
    sendingPerson.permissionRecords = sendingPerson.permissionRecords.filter(
      (record) => {
        return record.id !== id;
      }
    );
    req.body.status = "rejected";
    sendingPerson.permissionRecords.push(req.body);
    await sendingPerson.save();

    user.permissionRequests = user.permissionRequests.filter((record) => {
      return record.id !== id;
    });
    user.permissionRequests.push(req.body);
    await user.save();

    res.status(200).json({ data: sendingPerson.permissionRecords });
  } catch (error) {
    res.status(500).json({ error: "Something went wrong" });
  }
};
