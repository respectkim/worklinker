from app import  create_app2

#app = create_app()
app = create_app2()

if __name__ == "__main__":
    app.run(debug=True)