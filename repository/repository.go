package repository

import (
	"encoding/json"
	"fmt"
	"log/slog"
	"strconv"

	"gorm.io/driver/sqlite"
	"gorm.io/gorm"
)

type Page struct {
	Keyword string   `json:"kw"`
	Size    uint     `json:"size"`
	Current uint     `json:"current"`
	TagIds  []string `json:"tagIds"`
}

type Todo struct {
	gorm.Model
	Id     uint     `json:"id" gorm:"unique;primaryKey;autoIncrement"`
	Title  string   `json:"title"`
	Desc   string   `json:"desc"`
	Status string   `json:"status"`
	Tags   []string `json:"tags" gorm:"-"` // 忽略该字段存取
}

type Tag struct {
	gorm.Model
	Id   uint   `json:"id" gorm:"unique;primaryKey;autoIncrement"`
	Name string `json:"name"`
	Del  uint   `json:"del"`
}

type TodoTags struct {
	gorm.Model
	TodoId uint `gorm:"index:idx_todo_tag"`
	TagId  uint `gorm:"index:idx_todo_tag"`
}

func Init() {
	db, err := gorm.Open(sqlite.Open("D:\\data\\Todo\\Todo.db"), &gorm.Config{})
	if err != nil {
		panic("failed to connect database")
	}
	db.AutoMigrate(&Todo{})
	db.AutoMigrate(&Tag{})
	db.AutoMigrate(&TodoTags{})
}

func AddTodo(todo *Todo) {
	db, err := gorm.Open(sqlite.Open("D:\\data\\Todo\\Todo.db"), &gorm.Config{})
	if err != nil {
		panic("failed to connect database")
	}

	todo.Status = "TODO"

	todoData, err := json.Marshal(todo)
	if err != nil {
		return
	}
	slog.Info("todo: " + string(todoData))

	db.Transaction(func(tx *gorm.DB) error {
		// 在事务中执行一些 db 操作（从这里开始，您应该使用 'tx' 而不是 'db'）
		if err := tx.Create(&todo).Error; err != nil {
			// 返回任何错误都会回滚事务
			return err
		}

		todoTags := []TodoTags{}

		// 校验并创建todo和tag的关联关系
		for _, tagId := range todo.Tags {
			result, err := strconv.Atoi(tagId)
			if err != nil {
				return err
			}
			if result == 0 {
				slog.Error(fmt.Sprintf("error tag id: %v", result))
				return tx.Error
			}
			todoTags = append(todoTags, TodoTags{TodoId: todo.Id, TagId: uint(result)})
		}
		// 写入关联关系表
		if len(todoTags) > 0 {
			for _, todoTag := range todoTags {
				if err := tx.Create(&todoTag).Error; err != nil {
					return err
				}
			}
		}

		// 返回 nil 提交事务
		return nil
	})
}

func UpdateTodo(todo *Todo) {
	db, err := gorm.Open(sqlite.Open("D:\\data\\Todo\\Todo.db"), &gorm.Config{})
	if err != nil {
		panic("failed to connect database")
	}

	todoData, err := json.Marshal(todo)
	if err != nil {
		return
	}
	slog.Info("todo: " + string(todoData))

	db.Model(&todo).Update("title", todo.Title)
}

func MarkTodo(todo *Todo) {
	db, err := gorm.Open(sqlite.Open("D:\\data\\Todo\\Todo.db"), &gorm.Config{})
	if err != nil {
		panic("failed to connect database")
	}

	todoData, err := json.Marshal(todo)
	if err != nil {
		return
	}
	slog.Info("todo: " + string(todoData))

	db.Model(&todo).Update("status", todo.Status)
}

func RemoveTodo(todo *Todo) {
	db, err := gorm.Open(sqlite.Open("D:\\data\\Todo\\Todo.db"), &gorm.Config{})
	if err != nil {
		panic("failed to connect database")
	}

	todoData, err := json.Marshal(todo)
	if err != nil {
		return
	}
	slog.Info("todo: " + string(todoData))

	db.Delete(&Todo{}, todo.Id)
}

func ListTodo(page *Page) []Todo {
	db, err := gorm.Open(sqlite.Open("D:\\data\\Todo\\Todo.db"), &gorm.Config{})
	if err != nil {
		panic("failed to connect database")
	}

	tagIds := []uint{}
	for _, id := range page.TagIds {
		intId, err := strconv.Atoi(id)
		if err != nil {
			slog.Error(err.Error())
		}
		tagIds = append(tagIds, uint(intId))
	}

	subQuery := db.Table("todo_tags").Select("todo_id").Where("tag_id IN (?)", tagIds)

	todos := []Todo{}

	offset := (page.Current - 1) * page.Size

	query := db.Limit(int(page.Size)).Offset(int(offset))
	if page.Keyword != "" {
		query = query.Where("title LIKE ?", fmt.Sprintf("%%%v%%", page.Keyword))
	}

	if len(page.TagIds) > 0 {
		query = query.Where("id IN (?)", subQuery)
	}

	query.Find(&todos)

	// if len(page.TagIds) > 0 {
	// 	db.Where("title LIKE ?", fmt.Sprintf("%%%v%%", page.Keyword)).Where(subQuery).Limit(int(page.Size)).Offset(int(offset)).Find(&todos)
	// } else {
	// 	db.Where("title LIKE ?", fmt.Sprintf("%%%v%%", page.Keyword)).Limit(int(page.Size)).Offset(int(offset)).Find(&todos)
	// }

	return todos
}

func AddTag(tag *Tag) {
	db, err := gorm.Open(sqlite.Open("D:\\data\\Todo\\Todo.db"), &gorm.Config{})
	if err != nil {
		panic("failed to connect database")
	}

	tag.Del = 0

	db.Create(tag)
}

func UpdateTag(tag *Tag) {
	db, err := gorm.Open(sqlite.Open("D:\\data\\Todo\\Todo.db"), &gorm.Config{})
	if err != nil {
		panic("failed to connect database")
	}

	db.Model(&tag).Update("name", tag.Name)
}

func DelTag(tag *Tag) {
	db, err := gorm.Open(sqlite.Open("D:\\data\\Todo\\Todo.db"), &gorm.Config{})
	if err != nil {
		panic("failed to connect database")
	}

	slog.Info(string(tag.Id))

	db.Delete(&Tag{}, tag.Id)
}

func ListTag() []Tag {
	db, err := gorm.Open(sqlite.Open("D:\\data\\Todo\\Todo.db"), &gorm.Config{})
	if err != nil {
		panic("failed to connect database")
	}

	tags := []Tag{}

	db.Find(&tags)
	return tags
}
