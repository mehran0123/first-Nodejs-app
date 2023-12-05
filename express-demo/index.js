const Joi = require("joi");
const express = require("express");
const app = express();

app.use(express.json());

const courses = [
  { id: 1, name: "Course 1" },
  { id: 2, name: "Course 2" },
  { id: 3, name: "Course 3" },
];
app.get("/", (req, res) => {
  res.send("Hello World!!!");
});

//*** GET COURSES */
app.get("/api/courses", (req, res) => {
  res.send(courses);
});

//*** GET SINGLE COURSE */
app.get("/api/courses/:id", (req, res) => {
  const course = courses.find((c) => c.id === parseInt(req.params.id));
  if (!course) res.status(404).send("The course id not found");
  res.send(course);
});

//*** CREATE COURSE */
app.post("/api/courses", (req, res) => {
  const { error } = validateCourse(req.body);
  if (error) {
    res.status(400).send(error.details[0].message);
    return;
  }
  const course = {
    id: courses.length + 1,
    name: req.body.name,
  };
  courses.push(course);
  res.send(course);
});

//*** UPDATE COURSE */

app.put("/api/courses/:id", (req, res) => {
  const course = courses.find((c) => c.id === parseInt(req.params.id));
  if (!course) res.status(404).send("The course id not found.");

  const { error } = validateCourse(req.body);

  if (error) {
    res.status(400).send(error.details[0].message);
    return;
  }

  course.name = req.body.name;
  res.send(course);
});

//*** DELETE COURSE */
app.delete("/api/courses/:id", (req, res) => {
  const course = courses.find((c) => c.id === parseInt(req.params.id));
  if (!course) res.status(404).send("The course id not found.");

  const index = courses.indexOf(course);
  courses.splice(index, 1);
  return res.send(courses);
});

const port = process.env.PORT || 3000;

app.listen(port, () => console.log(`Litening On port ${port} `));

//** VALIDATION */
function validateCourse(course) {
  const schema = {
    name: Joi.string().min(3).required(),
  };

  return Joi.validate(course, schema);
}
