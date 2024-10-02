import { create } from "zustand";
import zukeeper from "zukeeper";

const data = {
  has_init: false,

  // basic information...
  name: "",
  email: "",
  position: "",
  institution: "",
  city: "",
  country: "",

  // strict information...
  // browser_id: "", // hide skip default

  access: [],
};

const store = create(
  zukeeper((set) => ({
    setDefault: () => set(() => ({ ...data })),
    setStore: (data) => set((state) => ({ ...state, ...data })),
    ...data,
  }))
);

export default store;
