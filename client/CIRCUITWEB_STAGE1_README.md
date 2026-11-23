# CircuitWeb Stage 1 – physical pins, breadboard nets and component assets

This additive patch backs up the integration files before modifying them. Existing components, direct wires, and EduLabX portal integration are retained. It does not delete project data.

## Included
- Pin maps for NE555, 74HC00, 74HC02, 74HC04, 74HC08, 74HC32, 74HC73 and 74HC86 DIP ICs, plus Arduino UNO header pins.
- Original vector assets for DIP ICs and Arduino UNO R3, plus an optional procedural 3D preview mode wired into the existing view tabs.
- 30-column solderless breadboard with five-hole terminal groups, center trench and separately split power rails.
- Additions to the existing sidebar component catalogue.
- Start a wire at a component pin, then release on a breadboard hole to register the insertion. A visible lead is drawn.
- `buildElectricalNetlist()` joins direct pin-to-pin wires and breadboard insertions into shared electrical nets. It is exposed in the store as `getElectricalNetlist()` for the next simulator stage.

## Apply
```bash
unzip circuitweb-stage1-architecture-patch.zip
cd circuitweb-stage1-patch
chmod +x apply-circuitweb-stage1.sh
./apply-circuitweb-stage1.sh ~/circuitweb-clone/client
cd ~/circuitweb-clone/client
pnpm build
```

## Scope and limitations
This is the first architecture stage, not a full SPICE simulator. The board uses the common five-hole terminal-row topology and split rails. It registers component pin-to-hole insertions and creates a netlist graph. Automatic DIP-leg-to-hole snapping, insertion removal UI, detailed manufacturer-grade 3D models and analog/digital solving are follow-up stages. The 3D tab is currently a procedural preview of the existing 2D component set, not a full 3D electrical editor. Verify every IC pinout against its exact manufacturer datasheet before building physical circuits.

A timestamped `.edulabx-stage1-backup-*` directory is created inside the target project. If needed, restore the backed-up files from that directory.

## Reference pinout sources
- Texas Instruments NE555 datasheet: https://www.ti.com/lit/ds/symlink/ne555.pdf
- Texas Instruments SN74HC00 datasheet: https://www.ti.com/lit/gpn/sn54hc00
- Texas Instruments SN74HC08 datasheet: https://www.ti.com/lit/ds/symlink/sn74hc08.pdf
- Arduino UNO R3 official documentation and downloadable pinout: https://docs.arduino.cc/hardware/uno-rev3/
