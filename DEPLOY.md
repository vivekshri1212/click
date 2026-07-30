# Deploy Guide

## Best option for this project

This app is not just a static frontend anymore. It now has:

- a Node.js server
- an API route at `/api/cart/save`
- MongoDB support

So the easiest deployment option is `Render` for the app and `MongoDB Atlas` for the database.

## Important

`mongodb://localhost:27017` works only on your own computer.

When you deploy online, you must use a cloud MongoDB URI from MongoDB Atlas, for example:

```env
MONGODB_URI=mongodb+srv://USERNAME:PASSWORD@cluster.mongodb.net/
DB_NAME=frontend_store
```

## Steps

1. Push this project to GitHub.
2. Create a MongoDB Atlas cluster.
3. Copy the Atlas connection string.
4. Open Render and create a new `Web Service`.
5. Connect your GitHub repo.
6. Render should detect `render.yaml` automatically.
7. Add this environment variable in Render:

```env
MONGODB_URI=your-atlas-connection-string
```

8. Deploy the service.

## Local run

```bash
npm install
npm start
```

Then open:

```text
http://localhost:3000
```

## Notes

- If MongoDB is not connected, the website will still open.
- Only the `Save Cart` API depends on MongoDB.
- For production, MongoDB Atlas is better than local MongoDB.
