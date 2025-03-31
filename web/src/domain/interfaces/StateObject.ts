export type StateObject<T> = {
  value: T
  set: React.Dispatch<React.SetStateAction<T>>
}