import { index, integer, jsonb, pgTable, serial, text, timestamp } from 'drizzle-orm/pg-core';

export const posts = pgTable(
    'posts',
    {
        id: serial('id').primaryKey(),
        name: text('name').notNull(),
        createdAt: timestamp('createdAt').defaultNow().notNull(),
        updatedAt: timestamp('updatedAt').defaultNow().notNull(),
    },
    (table) => [index('Post_name_idx').on(table.name)],
);

export const tracks = pgTable(
    'tracks',
    {
        id: text('id').primaryKey(),
        title: text('title').notNull(),
        artist: text('artist').notNull(),
        category: text('category').notNull(),
        durationSec: integer('durationSec').notNull(),
        tags: jsonb('tags').$type<string[]>().notNull().default([]),
        variants: jsonb('variants').$type<
            Array<{
                codec: 'webm' | 'm4a';
                bitrateKbps: number;
                url: string;
                bytes: number;
                hash: string;
            }>
        >().notNull(),
        createdAt: timestamp('createdAt').defaultNow().notNull(),
        updatedAt: timestamp('updatedAt').defaultNow().notNull(),
    },
    (table) => [index('Tracks_category_idx').on(table.category)],
);
