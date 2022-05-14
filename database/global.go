package database

import (
	"fmt"
	"sync"

	"github.com/abhi-kr-2100/motion2/config"
	"github.com/abhi-kr-2100/motion2/database/models"

	"gorm.io/driver/postgres"
	"gorm.io/gorm"
)

var db *gorm.DB
var once sync.Once

func DB() *gorm.DB {
	once.Do(func() {
		if db == nil {
			db = setupDB()
		}
	})

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

	migrate(db)

	return db
}

func migrate(db *gorm.DB) {
	err := db.AutoMigrate(&models.Todo{})
	if err != nil {
		panic(fmt.Sprintf("database: can't migrate todo: %v", err))
	}

	err = db.AutoMigrate(&models.User{})
	if err != nil {
		panic(fmt.Sprintf("database: can't migrate user: %v", err))
	}
}
