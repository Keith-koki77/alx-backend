#!/usr/bin/env python3
"""
Simple flask app
"""


from flask import Flask, render_template
from flask_babel import Babel


class Config(object):
    """
    Returns: type: description
    """
    LANGUAGES = ['en', 'fr']
    BABEL_DEFAULT_LOCALE = 'en'
    BABEL_DEFAULT_TIMEZONE = 'UTC'


'''
Configures the flask app
'''
app = Flask(__name__)
app.config.from_object(Config)
babel = Babel(app)


@app.route('/')
def index():
    """
    summary
    """
    return render_template('1-index.html')


if __name__ == '__main__':
    app.run(port="5000", host="0.0.0.0", debug=True)
