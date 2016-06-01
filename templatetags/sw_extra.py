from scriptus_write.utils import fsmanager as fs
from django import template

register = template.Library()


def description(value):
    return fs.get_string_content(value.description)

register.filter('description', description)
