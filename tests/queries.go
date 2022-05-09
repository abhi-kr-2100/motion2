package tests

// These are queries executed by GORM for the corresponding actions. They are
// useful for unit testing with sqlmock.
const (
	Query_GetUserByID       = `SELECT * FROM "users" WHERE id = $1 AND "users"."deleted_at" IS NULL ORDER BY "users"."id" LIMIT 1`
	Query_GetUserByUsername = `SELECT * FROM "users" WHERE username = $1 AND "users"."deleted_at" IS NULL ORDER BY "users"."id" LIMIT 1`

	Query_GetTodos          = `SELECT * FROM "todos" WHERE "todos"."deleted_at" IS NULL`
	Query_GetTodoByID       = `SELECT * FROM "todos" WHERE id = $1 AND "todos"."deleted_at" IS NULL ORDER BY "todos"."id" LIMIT 1`
	Query_GetTodosByOwnerID = `SELECT * FROM "todos" WHERE owner_id = $1 AND "todos"."deleted_at" IS NULL`

	Query_CreateTodo = `INSERT INTO "todos" ("created_at","updated_at","deleted_at","title","is_completed","owner_id") VALUES ($1,$2,$3,$4,$5,$6) RETURNING "id"`
	Query_DeleteTodo = `UPDATE "todos" SET "deleted_at"=$1 WHERE "todos"."id" = $2 AND "todos"."deleted_at" IS NULL`
	Query_UpdateTodo = `UPDATE "todos" SET "created_at"=$1,"updated_at"=$2,"deleted_at"=$3,"title"=$4,"is_completed"=$5,"owner_id"=$6 WHERE "todos"."deleted_at" IS NULL AND "id" = $7`
)
