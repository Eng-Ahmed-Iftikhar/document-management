import * as bcrypt from 'bcrypt';

export const hashedPassword = async(password: string) => {
   const saltRounds = 10; // Higher is more secure but slower
  const hashedPassword = await bcrypt.hash(password, saltRounds);
  return hashedPassword;
}

export const comparePassword = async(password: string, hashedPassword: string): Promise<boolean> => {
  const isMatch = await bcrypt.compare(password, hashedPassword);
  return isMatch;
}

