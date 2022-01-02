import { inspect } from 'util';

export const log = (obj: unknown) => console.log(inspect(obj, false, null, true));
