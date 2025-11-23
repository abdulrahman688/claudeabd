package main

import (
	"fmt"
	"log"
	"net/http"
	"os"

	"github.com/gin-gonic/gin"
)

func main() {
	r := gin.Default()

	r.GET("/health", func(c *gin.Context) {
		c.JSON(200, gin.H{"status": "healthy"})
	})

	r.POST("/api/v1/blockchain/deploy", func(c *gin.Context) {
		c.JSON(200, gin.H{"message": "Contract deployment endpoint"})
	})

	r.POST("/api/v1/blockchain/invest", func(c *gin.Context) {
		c.JSON(200, gin.H{"message": "Investment processing endpoint"})
	})

	port := os.Getenv("PORT")
	if port == "" {
		port = "3005"
	}

	fmt.Printf("🚀 Blockchain Service running on port %s\n", port)
	log.Fatal(r.Run(":" + port))
}
