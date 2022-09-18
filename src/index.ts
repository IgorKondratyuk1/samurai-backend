import express, {Request, Response} from 'express';

export const app = express();
const port = process.env.PORT || 3000;
export const HTTP_STATUSES = {
    OK_200: 200,
    CREATED_201: 201,
    NO_CONTENT_204: 204,

    BAD_REQUEST_400: 400,
    UNAUTHORIZED_401: 401,
    NOT_FOUND_404: 404
}

const jsonBodyMiddleware = express.json();
app.use(jsonBodyMiddleware);

const db = {
    courses: [
        {id: 1, title: "frontend"},
        {id: 2, title: "backend"},
        {id: 3, title: "devops"},
        {id: 4, title: "QA"},
    ]
}

app.get('/courses', (req, res) => {
    let foundCourses = db.courses;

    if (req.query.title) {
        foundCourses = db.courses
            .filter(c => c.title.includes(req.query.title as string));
    }

    res.json(foundCourses);
});
app.get('/courses/:id', (req, res) => {
    const foundCourse = db.courses.find(value => value.id === +req.params.id);

    if (!foundCourse) {
        res.sendStatus(HTTP_STATUSES.NOT_FOUND_404);
        return;
    }

    res.json(foundCourse);
});
app.post('/courses', (req, res) => {
    if (!req.body.title) {
        res.sendStatus(HTTP_STATUSES.BAD_REQUEST_400);
        return;
    }

    const createdCourse = {
        id: +(new Date()),
        title: req.body.title
    }

    db.courses.push(createdCourse);
    res.status(HTTP_STATUSES.CREATED_201)
        .json(createdCourse);
});
app.delete('/courses/:id', (req, res) => {
    const coursesLength = db.courses.length;
    db.courses = db.courses.filter(value => value.id !== +req.params.id);

    if (coursesLength === db.courses.length) {
        res.sendStatus(HTTP_STATUSES.NOT_FOUND_404);
        return;
    }
    res.sendStatus(HTTP_STATUSES.NO_CONTENT_204);
});
app.put('/courses/:id', (req, res) => {
    if (!req.body.title) {
        res.sendStatus(HTTP_STATUSES.BAD_REQUEST_400);
        return;
    }

    const foundCourse = db.courses.find(value => value.id === +req.params.id);
    if (!foundCourse) {
        res.sendStatus(HTTP_STATUSES.NOT_FOUND_404);
        return;
    }

    foundCourse.title = req.body.title;

    res.sendStatus(HTTP_STATUSES.NO_CONTENT_204);
});
app.delete('/__test__/data', (req: Request, res: Response) => {
    db.courses = [];
    res.sendStatus(HTTP_STATUSES.NO_CONTENT_204);
})

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`);
});