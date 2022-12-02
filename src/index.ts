import 'dotenv/config';

import Server from './Context/Shared/infrastructure/http/api/server';

const main = async (): Promise<void> => {
  try {
    const server = new Server();
    await server.start();
  } catch (error: any) {
    console.log(error);
    process.exit(1);
  }
};

main();
