import { Router } from 'express';
import createDebug from 'debug';
import { UsersController } from '../controllers/users.controller';
import { Role } from '@prisma/client';
import type { AuthInterceptor } from '../middleware/auth.interceptor';
import type { FileInterceptor } from '../middleware/file.interceptor';
const debug = createDebug('movies:router:users');

// Los métodos del controller no son arrow functions
// para tener aquí un ejemplo del uso de bind

export const createUsersRouter = (
    authInterceptor: AuthInterceptor,
    fileInterceptor: FileInterceptor,
    usersController: UsersController,
) => {
    debug('Ejecutando createFilmsRouter');
    const usersRouter = Router();
    usersRouter.get(
        '/',
        authInterceptor.authenticate,
        authInterceptor.hasRole(Role.ADMIN),
        usersController.getAll.bind(usersController),
    );
    usersRouter.get(
        '/:id',
        authInterceptor.authenticate,
        authInterceptor.isUser,
        usersController.getById.bind(usersController),
    );
    usersRouter.post(
        '/register',
        fileInterceptor.multer.bind(fileInterceptor),
        usersController.create.bind(usersController),
    );
    usersRouter.post('/login', usersController.login.bind(usersController));
    usersRouter.patch(
        '/role/:id',
        authInterceptor.authenticate,
        authInterceptor.hasRole(Role.ADMIN),
        usersController.setRole.bind(usersController),
    );
    usersRouter.patch(
        '/:id',
        authInterceptor.authenticate,
        authInterceptor.isUser,
        usersController.update.bind(usersController),
    );

    usersRouter.delete(
        '/:id',
        authInterceptor.authenticate,
        authInterceptor.isUser,
        usersController.delete.bind(usersController),
    );
    return usersRouter;
};
