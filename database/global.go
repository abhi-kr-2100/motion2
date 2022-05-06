package database

import "gorm.io/gorm"

var db *gorm.DB

func DB() *gorm.DB {
	if db == nil {
		db = setupDB()
	}

	return db
}

func setupDB() *gorm.DB {
	panic("database: not implemented")
}
