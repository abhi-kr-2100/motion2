package mode

type mode int

const (
	DevelopmentMode mode = iota
	ProductionMode
	TestMode
)

var current mode = DevelopmentMode

func Set(newMode mode) {
	current = newMode
}

func Current() mode {
	return current
}
