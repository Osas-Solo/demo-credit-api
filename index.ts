import app from "./app";

const port: string | undefined = process.env.PORT;

app.listen(port, () => {
    console.log(`⚡️[Demo Credit API]: Server is running at ${port}`);
});