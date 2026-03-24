# Logitech A50

I got bored, decided to map out the majority of the buffer inputs and map them.
I want to turn this into a GUI application but I am not sure when

I have not seen anyone reverse engineer the Gen 5 headsets and any information about them
are encrypted in a JSON file, on Windows, the JSON files are decoded in memory
via `lghub_agent.exe` or something like that.

I have no idea if this mapping works for anything outside Astro A50 built headsets
that are published by Logitech. Any evidence I would have had would is locked in the JSON files.

# Issues
On linux you need to `chmod` the driver file where the device is loaded.
So if you get a permission issue-- Thats why. Run it in sudo and `chmod a+rw <driver>>`