package main

import (
	"github.com/abhi-kr-2100/motion2/config"
	"github.com/abhi-kr-2100/motion2/routes"
)

func main() {
	cfg := config.Cfg()
	r := routes.Engine()

	r.Run(cfg.HostURL)
}
