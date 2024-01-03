#!/usr/bin/env python3
"""
Python script for LIFO Caching
"""

BaseCaching = __import__('base_caching').BaseCaching


class LIFOCache(BaseCaching):
    """
    Class LIFOCache inherits from BaseCaching and is a caching system
    """
    def __init__(self):
        """init method"""
        super().__init__()
        self.key_indexes = []

    def put(self, key, item):
        """
        The put method
        """
        if key and item:
            if len(self.cache_data) >= self.MAX_ITEMS:
                if key in self.cache_data:
                    del self.cache_data[key]
                    self.key_indexes.remove(key)
                else:
                    del self.cache_data[self.key_indexes[self.MAX_ITEMS - 1]]
                    discard = self.key_indexes.pop(self.MAX_ITEMS - 1)
                    print("DISCARD:", discard)
            self.cache_data[key] = item
            self.key_indexes.append(key)

    def get(self, key):
        """
        The get method
        """
        if key in self.cache_data:
            return self.cache_data[key]
        return None
