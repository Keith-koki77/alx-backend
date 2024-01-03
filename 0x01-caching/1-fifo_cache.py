#!/usr/bin/env python3
"""
Python scipt for FIFO Caching
"""

BaseCaching = __import__('base_caching').BaseCaching


class FIFOCache(BaseCaching):
    """
    Class FIFOCache inherits from BaseCaching and is a caching system
    """
    def __init__(self):
        """
        Init method
        """
        super().__init__()
        self.key_indexes = []

    def put(self, key, item):
        """Method put"""
        if key and item:
            if key in self.cache_data:
                self.cache_data[key] = item
                return
            if len(self.cache_data) >= BaseCaching.MAX_ITEMS:
                discard = self.key_indexes.pop(0)
                del self.cache_data[discard]
                print("DISCARD:", discard)
            self.cache_data[key] = item
            self.key_indexes.append(key)

    def get(self, key):
        """
        Returns the value in self.cache_data linked to key
        """
        if key in self.cache_data:
            return self.cache_data[key]
        return None
