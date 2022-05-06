package database

import (
	"fmt"

	"github.com/abhi-kr-2100/motion2/config"

	"gorm.io/driver/postgres"
	"gorm.io/gorm"
)

var db *gorm.DB

func DB() *gorm.DB {
	if db == nil {
		db = setupDB()
	}

	return db
}

func SetCustomDB(newDB *gorm.DB) {
	db = newDB
}

func setupDB() *gorm.DB {
	cfg := config.Cfg()

	db, err := gorm.Open(postgres.Open(cfg.DBConnURL), &gorm.Config{})
	if err != nil {
		panic(fmt.Sprintf("database: can't connect to db: %v", err))
	}

	return db
}
