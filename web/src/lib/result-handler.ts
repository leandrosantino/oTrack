
// class ErrorHandle<T> implements IErrorHandler<T> {
//   type: string
//   data: T

//   constructor(type: string, data: T) {
//     this.type = type
//     this.data = data
//   }

//   case(type: string, callback: VoidFunction) {
//     if (this.type === type) {
//       callback()
//     }
//     return this
//   }
// }

export const Ok = <T>(value: T): Result<T, never> => ({ ok: true, value });
export const Err = <E>(err: E): Result<never, E> => ({ ok: false, err });
