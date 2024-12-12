from controllers.user_controller import user_bp

def register_user_routes(app):
    app.register_blueprint(user_bp, url_prefix="/users")