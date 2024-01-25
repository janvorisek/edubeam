# Elements

We currently offer two types of 2D elements:

## 2D Timoshenko Beam

Timoshenko beam theory accommodates shear deformation and rotational bending in thick beams and high-frequency situations. A more theoretical background can be found in the [Theory manual](/elements/beam).

<TrussElement :moment="true" caption="Schematic of 2D Timoshenko beam" />

Ideal for versatile beam configurations, supporting static condensation at the ends ($M_y=0$) and internal hinges for complex structural simulations.

The many properties of the beam element can be edited in the Bottom Bar:

<figure>
<img src="/elements.png" />
<figcaption>Bottom Bar - Beam element overview</figcaption>
</figure>

The new elements can be added either by using the Add Node Dialog or with mouse by clicking on the two distinct nodes.

## 2D Truss Element

A truss element is a structural component designed to bear only axial forces, commonly used in bridges and buildings. A more theoretical background can be found in the [Theory manual](/elements/truss).

<TrussElement :hinges="[true, true]"  caption="Schematic of 2D truss element" />

Perfect for basic truss structures, offering ease of use without rotational considerations.

<hr>

Understanding these DOFs for each element ensures precise modeling and efficient structural analysis in Edubeam.
