import { hash, compare } from 'bcryptjs';
import { AuthService, Payload } from './auth.service';
import jwt from 'jsonwebtoken';
import { sign } from 'crypto';

vi.mock('bcryptjs', () => ({
    hash: vi.fn().mockResolvedValue('soy un has'),
    compare: vi.fn().mockResolvedValue(true),
}));

vi.mock('jsonwebtoken');

describe('Given the class AuthService', () => {
    const token = 'Este es un token';

    const payload = {
        id: 'id',
        email: 'email',
        role: 'role',
    } as Payload;

    describe('When hashPassword is called', () => {
        test('Then is should call hash form bcript', async () => {
            const password = 'Esto es un password';
            const result = await AuthService.hashPassword(password);

            expect(hash).toHaveBeenCalledWith(password, 10);
            expect(result).toBe('soy un has');
        });
    });

    describe('When compare password is called', () => {
        test('Then it should compare password', async () => {
            const password = 'Soy una password';
            const hash = 'Soy un Hash';
            const result = await AuthService.comparePassword(password, hash);

            expect(result).toBe(true);
            expect(compare).toHaveBeenCalledWith(password, hash);
        });
    });

    describe('When generateToken is called', () => {
        test('Then call sing with & secret', async () => {
            //const secret = 'contraseña secreta';
            jwt.sign = vi.fn().mockReturnValue(token);
            const result = await AuthService.generateToken(payload);

            expect(result).toBe(token);
            expect(jwt.sign).toHaveBeenCalledWith(undefined);
        });
    });
});
