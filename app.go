package main

import (
	"context"
	"encoding/json"
	"log/slog"
	"wails-todo-app/repository"
)

// App struct
type App struct {
	ctx context.Context
}

// NewApp creates a new App application struct
func NewApp() *App {
	return &App{}
}

// startup is called when the app starts. The context is saved
// so we can call the runtime methods
func (a *App) startup(ctx context.Context) {
	a.ctx = ctx
	repository.Init()
}

type Result[T any] struct {
	Code    uint   `json:"code"`
	Message string `json:"message"`
	Data    T      `json:"data"`
}

type PageResult[T any] struct {
	Code    uint   `json:"code"`
	Message string `json:"message"`
	Data    []T    `json:"data"`
}

func (a *App) AddTodo(todoStr string) string {
	slog.Info(todoStr)
	todo := repository.Todo{}
	json.Unmarshal([]byte(todoStr), &todo)
	repository.AddTodo(todo)
	return "success"
}

func (a *App) MarkTodo(todoStr string) string {
	todo := repository.Todo{}
	json.Unmarshal([]byte(todoStr), &todo)
	repository.MarkTodo(todo)
	return "success"
}

func (a *App) RemoveTodo(todoStr string) string {
	todo := repository.Todo{}
	json.Unmarshal([]byte(todoStr), &todo)
	repository.RemoveTodo(todo)
	return "success"
}

func (a *App) UpdateTodo(todoStr string) string {
	todo := repository.Todo{}
	json.Unmarshal([]byte(todoStr), &todo)
	repository.UpdateTodo(todo)
	return "success"
}

func (a *App) ListTodo(pageStr string) string {
	page := repository.Page{}
	json.Unmarshal([]byte(pageStr), &page)
	todos := repository.ListTodo(page)
	result := PageResult[repository.Todo]{Code: 200, Message: "success", Data: todos}
	jsonData, err := json.Marshal(result)
	if err != nil {
		return ""
	}
	return string(jsonData)
}

func (a *App) AddTag(tagStr string) string {
	tag := repository.Tag{}
	json.Unmarshal([]byte(tagStr), &tag)

	repository.AddTag(&tag)
	return "success"
}

func (a *App) UpdateTag(tagStr string) string {
	tag := repository.Tag{}
	json.Unmarshal([]byte(tagStr), &tag)

	repository.UpdateTag(&tag)
	return "success"
}

func (a *App) DelTag(tagStr string) string {
	tag := repository.Tag{}
	json.Unmarshal([]byte(tagStr), &tag)

	repository.DelTag(&tag)
	return "success"
}

func (a *App) ListTag() string {
	tags := repository.ListTag()
	result := PageResult[repository.Tag]{Code: 200, Message: "success", Data: tags}
	jsonData, err := json.Marshal(result)
	if err != nil {
		return ""
	}
	return string(jsonData)
}
