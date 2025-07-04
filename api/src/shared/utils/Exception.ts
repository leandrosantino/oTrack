
export class Exception extends Error {

  public type: string
  public data: any

  constructor({ message, type, data }: { message: string, type: string, data?: any }) {
    super(message, { cause: type })
    this.type = type
    this.data = data
  }

  details() {
    return {
      message: this.message,
      type: this.type
    }
  }

  throw() { throw this }

}
