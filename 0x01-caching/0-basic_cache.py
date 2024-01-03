#!/usr/bin/env python3
"""
Script for Basic Dictionary
"""
BaseCaching = __import__('base_caching').BaseCaching


class BasicCache(BaseCaching):
    """
    Class BasicCache inherits from BaseCaching and is a caching system
    """
    def put(self, key, item):
        """
        Assigns to dictionary self.cache_data the item value for the key
        """
        if key and item:
            self.cache_data[key] = item

    def get(self, key):
        """
        Returns the value in self.cache_data linked to key
        """
        return self.cache_data.get(key, None)
