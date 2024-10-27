export {};

declare global{
  interface User  {
    userid: string;
    firstname: string;
    lastname: string;
    email: string;
    age?: number;
    denomination?: string;
    rates: number;
    defaultrates: number;
    createdat: string;
    lastactive: string;
    suspended: boolean;
  }
}