import { atom } from "jotai";

export const logInDataAtom=atom({ email: "", password: "" });
export const signupDataAtom=atom({ email: "", password: "", confirmPassword: "", });
export const userInfoAtom=atom();
