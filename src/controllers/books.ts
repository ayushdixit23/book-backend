import asyncHandler from "../middlewares/tryCatch.js";
import { getUniqueId, readDB, writeDB } from "../utils/utils.js";
import { Request, Response } from "express";

export const createBook = asyncHandler(async (req: Request, res: Response) => {
    const db = await readDB();
    const newBook = { ...req.body, id: getUniqueId() };
    db.push(newBook);
    res.status(201).json({ newBook, success: true });
    await writeDB(db);
});

export const deleteBook = asyncHandler(async (req: Request, res: Response) => {
    const { id } = req.params
    const db = await readDB()
    const newdb = db.filter((p: any) => p.id != id);
    await writeDB(newdb);
    res.status(200).json({ message: "Book Deleted Successfully!", success: true });
});

export const getAllBooks = asyncHandler(async (req: Request, res: Response) => {
    const db = await readDB();

    const page = parseInt(req.query.page as string) || 1;
    const limit = 10;

    const search = typeof req.query.search === 'string' ? req.query.search.toLowerCase() : '';
    const genre = typeof req.query.genre === 'string' ? req.query.genre : '';
    const status = typeof req.query.status === 'string' ? req.query.status : '';

    let filteredBooks = db.filter((book: any) => {
        const matchesSearch =
            book.title.toLowerCase().includes(search) ||
            book.author.toLowerCase().includes(search);

        const matchesGenre = genre ? book.genre === genre : true;
        const matchesStatus = status ? book.status === status : true;

        return matchesSearch && matchesGenre && matchesStatus;
    });

    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + limit;
    const paginatedBooks = filteredBooks.slice(startIndex, endIndex);

    res.status(200).json({
        page,
        total: filteredBooks.length,
        totalPages: Math.ceil(filteredBooks.length / limit),
        books: paginatedBooks,
        success: true,
    });
});

export const updateBook = asyncHandler(async (req: Request, res: Response) => {
    const db = await readDB();
    const { id } = req.params
    const data = req.body.data
    const newdb = db.map((p: any) => p.id == id ? { id: id, ...data } : p);
    await writeDB(newdb);
    res.status(200).json({ message: "Book Updated Successfully!", success: true });
})

export const getBookById = asyncHandler(async (req: Request, res: Response) => {
    const db = await readDB();
    const { id } = req.params
    const books = db.filter((p: any) => p.id == id);
    if (books.length <= 0) {
        return res.status(200).json({ message: "No Book Found with this id!", success: true });
    }
    const book = books[0]
    res.status(200).json({ book, success: true });
})