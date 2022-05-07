package tests

// These are queries executed by GORM for the corresponding actions. They are
// useful for unit testing with sqlmock.
const (
	Query_GetUserByID       = `SELECT * FROM "users" WHERE id = $1 AND "users"."deleted_at" IS NULL ORDER BY "users"."id" LIMIT 1`
	Query_GetUserByUsername = `SELECT * FROM "users" WHERE username = $1 AND "users"."deleted_at" IS NULL ORDER BY "users"."id" LIMIT 1`

	Query_GetTodoByID       = `SELECT * FROM "todos" WHERE id = $1 AND "todos"."deleted_at" IS NULL ORDER BY "todos"."id" LIMIT 1`
	Query_GetTodosByOwnerID = `SELECT * FROM "todos" WHERE owner_id = $1 AND "todos"."deleted_at" IS NULL`
)