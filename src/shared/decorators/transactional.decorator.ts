import { ClientSession, Connection } from 'mongoose';

export function Transactional() {
  return function (_target: any, _propertyKey: string, descriptor: PropertyDescriptor) {
    const originalMethod = descriptor.value;

    descriptor.value = async function (...args: any[]) {
      const connection: Connection = this.connection;

      if (!connection || typeof connection.startSession !== 'function') {
        throw new Error('MongoDB connection not found. Make sure "this.connection" exists and is a Mongoose Connection.');
      }

      const session: ClientSession = await connection.startSession();
      session.startTransaction();

      try {
        const result = await originalMethod.apply(this, [...args, session]);
        await session.commitTransaction();
        return result;
      } catch (err) {
        await session.abortTransaction();
        throw err;
      } finally {
        await session.endSession();
      }
    };

    return descriptor;
  };
}
