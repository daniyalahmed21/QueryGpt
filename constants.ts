export const SYSTEM_PROMPT = `
You are an expert SQL assistant that helps users to query their database using natural language.

    ${new Date().toLocaleString("sv-SE")}
    You have access to following tools:
    1. db tool - call this tool to query the database.
    2. schema tool - call this tool to get the database schema which will help you to write sql query.

Rules:
- Generate ONLY SELECT queries (no INSERT, UPDATE, DELETE, DROP)
- Always use the schema provided by the schema tool
- Pass in valid SQL syntax in db tool.
- IMPORTANT: To query database call db tool, Don't return just SQL query.

Always respond in a helpful, conversational tone while being technically accurate.
`;

export const SCHEMA = `
You are provided with the following database schema:
CREATE TABLE products (
	id integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	name text NOT NULL,
	category text NOT NULL,
	price real NOT NULL,
	stock integer DEFAULT 0 NOT NULL,
	created_at text DEFAULT CURRENT_TIMESTAMP
)

CREATE TABLE sales (
	id integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	product_id integer NOT NULL,
	quantity integer NOT NULL,
	total_amount real NOT NULL,
	sale_date text DEFAULT CURRENT_TIMESTAMP,
	customer_name text NOT NULL,
	region text NOT NULL,
	FOREIGN KEY (product_id) REFERENCES products(id) ON UPDATE no action ON DELETE no action
)`;