from controllers.product_controller import product_bp

def register_product_routes(app):
    app.register_blueprint(product_bp, url_prefix="/items")