import { atom } from "recoil";

export const isShowPopupState = atom<boolean>({
  key: "isShowPopup",
  default: true,
});
