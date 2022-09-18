import request from "supertest";
import {app, HTTP_STATUSES} from "../../src";

describe("/course", () => {
    // Clear data in db before tests
    beforeAll(async () => {
        await request(app)
            .delete('/__test__/data');
    });

    it("should return 200 and empty array", async () => {
        await request(app)
            .get("/courses")
            .expect(HTTP_STATUSES.OK_200, []);
    });

    it("should return 404, no course founded", async () => {
        await request(app)
            .get("/courses")
            .expect(HTTP_STATUSES.OK_200, []);
    });

    it("shouldn't create course with title: null", async () => {
        await request(app)
            .post("/courses")
            .send({
                title: null
            })
            .expect(HTTP_STATUSES.BAD_REQUEST_400);

        // Check courses is empty
        await request(app)
            .get("/courses")
            .expect(HTTP_STATUSES.OK_200, []);
    });

    it("shouldn't create course without title", async () => {
        await request(app)
            .post("/courses")
            .send({})
            .expect(HTTP_STATUSES.BAD_REQUEST_400);

        // Check courses is empty
        await request(app)
            .get("/courses")
            .expect(HTTP_STATUSES.OK_200, []);
    });

    let createdFirstCourse: any = null;
    it("should create first course with correct input data", async () => {
        const testResponse = await request(app)
            .post("/courses")
            .send({
                title: "First_title"
            })
            .expect(HTTP_STATUSES.CREATED_201);

        createdFirstCourse = testResponse.body;

        expect(createdFirstCourse).toEqual({
            id: expect.any(Number),
            title: "First_title"
        });

        // Check that course is created
        await request(app)
            .get("/courses")
            .expect(HTTP_STATUSES.OK_200, [createdFirstCourse]);
    });

    let createdSecondCourse: any = null;
    it("should create second course with correct input data", async () => {
        const testResponse = await request(app)
            .post("/courses")
            .send({
                title: "Test_title"
            })
            .expect(HTTP_STATUSES.CREATED_201);

        createdSecondCourse = testResponse.body;

        expect(createdSecondCourse).toEqual({
            id: expect.any(Number),
            title: "Test_title"
        });

        // Check that course is created
        await request(app)
            .get("/courses/" + createdSecondCourse.id)
            .expect(HTTP_STATUSES.OK_200, createdSecondCourse);
    });

    it("shouldn't update course with incorrect input data", async () => {
        await request(app)
            .put("/courses/" + createdFirstCourse.id)
            .send({
                title: ""
            })
            .expect(HTTP_STATUSES.BAD_REQUEST_400);

        // Check that course is not update
        await request(app)
            .get("/courses/" + createdFirstCourse.id)
            .expect(HTTP_STATUSES.OK_200, createdFirstCourse);
    });

    it("shouldn't update course that not exists", async () => {
        await request(app)
            .put("/courses/" + "10000")
            .send({
                title: "Good title"
            })
            .expect(HTTP_STATUSES.NOT_FOUND_404);
    });

    it("should update course with correct data", async () => {
        await request(app)
            .put("/courses/" + createdFirstCourse.id)
            .send({
                title: "Good title"
            })
            .expect(HTTP_STATUSES.NO_CONTENT_204);


        // Check that course is created
        await request(app)
            .get("/courses/" + createdFirstCourse.id)
            .expect(HTTP_STATUSES.OK_200, {
                    ...createdFirstCourse,
                    title: "Good title"
                }
            );
    });

    it("should delete courses", async () => {
        //Delete first course
        await request(app)
            .delete("/courses/" + createdFirstCourse.id)
            .expect(HTTP_STATUSES.NO_CONTENT_204);

        // Check that course is deleted
        await request(app)
            .get("/courses/" + createdFirstCourse.id)
            .expect(HTTP_STATUSES.NOT_FOUND_404);

        //Delete second course
        await request(app)
            .delete("/courses/" + createdSecondCourse.id)
            .expect(HTTP_STATUSES.NO_CONTENT_204);

        // Check that course is deleted
        await request(app)
            .get("/courses/" + createdSecondCourse.id)
            .expect(HTTP_STATUSES.NOT_FOUND_404);

        // Check that courses is empty
        await request(app)
            .get("/courses")
            .expect(HTTP_STATUSES.OK_200, []);
    });

    it("shouldn't delete course with wrong id", async () => {
        await request(app)
            .delete("/courses/" + "1000")
            .expect(HTTP_STATUSES.NOT_FOUND_404);
    });
});