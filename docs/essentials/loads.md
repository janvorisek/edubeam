# Loads

## Nodal Load

Nodal loads in represent external forces applied directly to nodes. Each nodal load is specified in the direction of the corresponding DOF.

Nodal loads allow users to simulate external forces acting on specific points in the structure.

## Element loads

### Uniformly Distributed Load

The Uniformly Distributed Load applies a uniform distributed load across the entire length of the structural element.

Component specifications can be in either the global coordinate system or the local coordinate system of the element.

### Linearly Distributed Load

The Linearly Distributed Load represents a trapezoidal distribution of forces along the length of the structural element.

Component specifications can be in either the global coordinate system or the local coordinate system of the element.

<figure>
<img src="/add_UDL.png" style="height: 300px" />
<figcaption>Add UDL dialog</figcaption>
</figure>

### Temperature load

The Temperature Load models the effects of temperature changes on structural elements. The software generates a temperature load vector for each element node, considering the coefficient of thermal expansion and the specified temperature change.

The two different cases of temperature loads in structural analysis are commonly referred to as:

- **Uniform Temperature Change**: This represents a uniform temperature change applied across the entire structural element. The magnitude of temperature change is constant throughout the element. The load elongates or contracts the beam alogn its central axis.

- **Non-uniform Temperature Load**: This represents a difference in temperature between the top and bottom fibers of the structural element. The load bend the element along the Y-axis.

In <Edubeam /> the Temperature Load is defined by specifying the temperature of the top and bottom fibers. Both cases and the corresponding load vectors are automatically calculated.

It is possible to ignore the effects of the Uniform Temperature Load.
