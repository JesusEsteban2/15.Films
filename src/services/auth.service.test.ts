import { hash } from 'bcryptjs';
import { AuthService } from './auth.service';

vi.mock('bcryptjs', () => ({
    hash: vi.fn().mockResolvedValue('soy un has'),
}));

describe('Given the class AuthService', () => {
    describe('When hashPassword is called', () => {
        test('Then is should call hash form bcript', async () => {
            const password = 'Esto es un password';
            const result = await AuthService.hashPassword(password);
            expect(hash).toHaveBeenCalledWith(password);
            expect(result).toBe('soy un has');
            console.log(result);
        });
    });
});
