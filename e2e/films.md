import request from 'supertest';
import { createApp } from '../src/app';
import { describe, test, expect } from 'vitest';

const app = createApp();
const urlApi = '/api/films';
app.listen(3050, () => {});

let filmID = '';
let newID = '';

const token =
    'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6Ijc3NWNiMGNlLTU1NWYtNGQ3OC05MDkyLTgyYTIzY2JmNDZlOSIsImVtYWlsIjoicm9zYUBhY21lLmNvbSIsInJvbGUiOiJFRElUT1IiLCJpYXQiOjE3NDE1OTk1NTF9.5eyg_dKbPLkSffjmIpbdDPXqmOXhtuiNGWaz2LDyLqs';

describe('GET /api/films', () => {
    test('should return 200 OK', async () => {
        // request(app).get(urlApi).expect(200)
        const response = await request(app).get(urlApi);
        expect(response.status).toBe(200);
        filmID = response.body.results[0].id;
    });
});

describe('GET /api/films/:id', () => {
    test('should return 404 if ID not found', async () => {
        const url = `${urlApi}/${crypto.randomUUID()}`;
        const response = await request(app).get(url);
        expect(response.status).toBe(404);
    });
    test('should return 200 if ID found', async () => {
        const url = `${urlApi}/${filmID}`;
        const response = await request(app).get(url);
        expect(response.status).toBe(200);
    });
});

describe('POST /api/films', () => {
    const newFilm = {
        title: 'Test Film',
        description: 'Test Description',
        releaseYear: 2023,
        rating: 5,
        director: 'Test Director',
        duration: 120,
        poster: 'https://example.com/test.jpg',
    };

    test('should return 401 it is NOT AUTHORIZED USER', async () => {
        const response = await request(app).post(urlApi).send(newFilm);
        expect(response.status).toBe(401);
    });
    test('should return 201 Created', async () => {
        const response = await request(app)
            .post(urlApi)
            .set('Authorization', `Bearer ${token}`)
            .send(newFilm);
        newID = response.body.results[0].id;
        expect(response.status).toBe(201);
        expect(response.body.results[0].title).toBe(newFilm.title);
        expect(newID).toHaveLength(36);
    });
});

describe('PATCH /api/films/:id', () => {
    test('should return 401 if NOT AUTHORIZED USER', async () => {
        const url = `${urlApi}/${newID}`;
        const response = await request(app)
            .patch(url)
            .send({ title: 'New Title' });
        expect(response.status).toBe(401);
    });
    test('should return 200 if ID found', async () => {
        const url = `${urlApi}/${newID}`;
        const response = await request(app)
            .patch(url)
            .set('Authorization', `Bearer ${token}`)
            .send({ title: 'New Title' });
        expect(response.status).toBe(200);
        expect(response.body.results[0].title).toBe('New Title');
    });
});

describe('DELETE /api/films/:id', () => {
    test('should return 401 if NOT AUTHORIZED USER', async () => {
        const url = `${urlApi}/${newID}`;
        const response = await request(app).delete(url);
        expect(response.status).toBe(401);
    });
    test('should return 200 if ID found', async () => {
        const url = `${urlApi}/${newID}`;
        const response = await request(app)
            .delete(url)
            .set('Authorization', `Bearer ${token}`);
        expect(response.status).toBe(200);
    });
});
