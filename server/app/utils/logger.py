import logging, sys
def setup_logging():
    root = logging.getLogger()
    h = logging.StreamHandler(sys.stdout)
    formatter = logging.Formatter('%(asctime)s %(levelname)s %(name)s - %(message)s')
    h.setFormatter(formatter)
    root.addHandler(h)
    root.setLevel(logging.INFO)
