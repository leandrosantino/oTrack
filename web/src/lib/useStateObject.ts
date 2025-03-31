import { StateObject } from "@/domain/interfaces/StateObject";
import { useState } from "react";

export function useStateObject<T>(initial?: T): StateObject<T> {
  const [value, set] = useState<T>(initial as T)
  return { value, set }
}