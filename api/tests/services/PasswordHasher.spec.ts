import bcrypt from 'bcrypt';
import { PasswordHasher } from 'services/PasswordHasher/PasswordHasher';

jest.mock('bcrypt', () => ({
  hash: jest.fn(),
  compare: jest.fn(),
}));

describe('PasswordHasher', () => {
  const passwordHasher = new PasswordHasher();

  describe('hash', () => {
    it('should hash a password using bcrypt', async () => {
      const plainPassword = 'securePassword';
      const hashedPassword = 'hashedPassword';

      // Mockando o retorno do bcrypt.hash
      (bcrypt.hash as jest.Mock).mockResolvedValue(hashedPassword);

      const result = await passwordHasher.hash(plainPassword);

      expect(result).toBe(hashedPassword);
      expect(bcrypt.hash).toHaveBeenCalledWith(plainPassword, 10); // 10 é o número de saltRounds
    });
  });

  describe('verify', () => {
    it('should return true when passwords match', async () => {
      const plainPassword = 'securePassword';
      const hashedPassword = 'hashedPassword';

      // Mockando o retorno do bcrypt.compare
      (bcrypt.compare as jest.Mock).mockResolvedValue(true);

      const result = await passwordHasher.verify(plainPassword, hashedPassword);

      expect(result).toBe(true);
      expect(bcrypt.compare).toHaveBeenCalledWith(plainPassword, hashedPassword);
    });

    it('should return false when passwords do not match', async () => {
      const plainPassword = 'securePassword';
      const hashedPassword = 'differentHashedPassword';

      // Mockando o retorno do bcrypt.compare
      (bcrypt.compare as jest.Mock).mockResolvedValue(false);

      const result = await passwordHasher.verify(plainPassword, hashedPassword);

      expect(result).toBe(false);
      expect(bcrypt.compare).toHaveBeenCalledWith(plainPassword, hashedPassword);
    });
  });
});
