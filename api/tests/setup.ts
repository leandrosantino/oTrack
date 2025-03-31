import "reflect-metadata"
import { Err, Ok } from 'utils/ResultHandler'

(globalThis as any).Ok = Ok;
(globalThis as any).Err = Err;
