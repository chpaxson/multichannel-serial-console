# Multichannel Serial Console

A Vue 3 / TypeScript Web Serial console, hosted at
https://chpaxson.github.io/multichannel-serial-console/. Run it locally with
`npm install` and `npm run dev`; `npm test` runs the regression tests and
`npm run build` type-checks and builds to `dist/`. Deployment to GitHub Pages
(including the Windows Telnet gateway build) runs from `.github/workflows/pages.yml`;
set **Settings → Pages → Source** to **GitHub Actions**.

The **Home** link returns to https://chpaxson.github.io/tools.

## Usage

Open the console in desktop Chrome or Edge over HTTPS or localhost. Each of up to eight
columns connects to a separate serial device or Telnet target. Serial devices
have their own baud rate, data/stop bits, parity, and flow control. **Refresh
Ports** reopens connected devices without another device picker.

The connection button is green while connected and red after disconnection. Click
the red **Reconnect** button to reopen the same port, or **Choose port** to
select another. The remembered device lasts for the current page session.
Unexpected disconnections also show a dismissible, timestamped warning in the
bottom-right corner of the affected console.
Use **Tabbed view** in the title bar to switch between tabs and columns without
closing connections. Drag a divider or use its arrow keys to resize only its two
adjacent columns; double-click it or press Home to make those columns equal.
Column widths are saved with the other preferences.
At 600 px wide or less, ports switch to tabs; connections and logging continue
for background tabs. Disconnect warnings are indicated on the affected tab.
Use Left/Right or Home/End to navigate tabs. Resizing returns
when the screen widens unless tabbed view is selected.

#### Telnet connections

Browsers cannot connect directly to Telnet TCP ports. In a column's **Options**,
select **Telnet** and download the Windows gateway. Put the executable in a
permanent location before enabling startup, then run these commands from that
directory in PowerShell:

```powershell
.\telnet-gateway.exe init
.\telnet-gateway.exe token
.\telnet-gateway.exe run
```

Initialization creates a random token and a private, user-restricted configuration
directory in `%LOCALAPPDATA%\SerialConsoleGateway`. Copy the token from the local
terminal, open **Manage gateway**, and enter it to unlock this browser page.
Add or remove host/port destinations there; removing a destination disconnects
its active sessions. Multiple targets and connections are supported. Select an
allowed address and port in each column's **Options** to connect. IPv6 addresses
must use brackets, for example `[::1]`. Allowed destinations persist in the
gateway; the browser keeps the token only in memory and requires it again after
reload. **Lock gateway** disconnects this page's Telnet sessions. Stop a manually
run gateway with Ctrl+C.

The default allowed origin is `https://chpaxson.github.io`. To use another
origin or local development, specify every allowed origin during initial setup:

```powershell
.\telnet-gateway.exe init --origin https://chpaxson.github.io --origin http://127.0.0.1:5173
```

Origins must match the browser address exactly, without a trailing slash; HTTP
origins are permitted only on localhost. To opt in to starting the executable at
Windows user login, run `.\telnet-gateway.exe install-startup`. Remove that
shortcut with `.\telnet-gateway.exe uninstall-startup`. Startup is not enabled
automatically, and a running gateway remains locked to unauthenticated clients.
The shortcut points to the executable's current path, so reinstall it if the
executable moves. No administrator privileges are required. The executable is
unsigned; Windows may display a SmartScreen warning.

The Python source is in `gateway/`; on other systems, install
`gateway/requirements.txt` and run `python gateway/gateway.py` with the same
commands. The packaged executable and startup commands are Windows-specific.
The deployment workflow builds the executable on Windows and includes it in the
website download.

The gateway listens only on `127.0.0.1:8765` and requires both an allowed
browser origin and the token before accepting commands or connections. Do not
share the token. Scripts on an allowed origin that obtain it can change the
allowlist and access those destinations; other programs running as your user may
also be able to read it. Local administrators can take ownership of the files.
Only allow websites and targets you trust. Telnet is **unencrypted**, including
passwords; use it only on trusted networks. The gateway declines Telnet option
negotiation and does not implement terminal emulation beyond the console's
existing display. Browser local-network permissions may need to be granted.

To run gateway tests from a Python environment with the gateway requirements:

```sh
python -m unittest discover -s gateway -p test_gateway.py -v
```

Send text with optional CR/LF endings, `\xHH` byte escapes, or backtick-delimited
key escapes such as `` `CTRL+C` `` and `` `ESC` ``. **Send Char** sends only the
first Unicode character without escapes or appended line endings. Failed writes
retain the input for retry.

Display options include ANSI colors/styles, timestamps, message numbers,
outgoing data visibility, auto-scroll, and a resizable text/hex view with linked
selection highlighting. Metadata has a separate background; copying a selection
started in the message text excludes metadata and hex data across messages.
Selections started in the metadata or hex view copy only that portion.
The per-column buffer holds 10–20,000 messages.
**Start Logging** records messages in memory; **Stop Logging (Save File)**
downloads the log. Logging can include metadata and existing buffered history.
These logging options are under **Log options** beside the logging button.
Removing a logging column prompts before saving its log; leaving while logging
requests browser confirmation. Incoming data and log contents are not uploaded.

Layout, theme, and per-column preferences use the existing `wsc_global` /
`wsc_col_*` cookies, so saved settings from the previous console carry over.
Messages and active connections are not persisted. Connection, read/write, and
preference errors appear in the console interface.

Shared theme, typography, header, panel, input, button, and dialog styles are in
`src/assets/tools.css`. Leaving the page disconnects its devices; while logging,
the browser asks for confirmation first.

Integer fields (columns, buffer size, baud rate, copies, and PPI) have minus/plus
buttons alongside the editable spin box. Buttons respect each field's limits and
step size; direct typing and keyboard arrow controls remain available. Distance
fields retain decimal/unit entry, and the threshold control remains a slider.

Run console regression tests (no hardware required) on Node.js 22.14 or later:

```sh
npm test
```

