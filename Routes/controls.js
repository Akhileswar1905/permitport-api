import express from "express";
import {
  SignUp,
  SignIn,
  GetPerson,
  GetAllUsers,
  deleteUser,
  updateUser,
  permissionReq,
  GetFac,
  grantedPermission,
  rejectedPermission,
} from "../Controls/controls.js";

const router = express.Router();

router.post("/signin", SignIn);

router.post("/signup", SignUp);

router.get("/staff", GetFac);

router.post("/req", permissionReq);

router.post("/grant", grantedPermission);

router.post("/reject", rejectedPermission);

router.get("/:id", GetPerson);

router.get("/", GetAllUsers);

router.delete("/:id", deleteUser);

router.put("/:id", updateUser);

export default router;
