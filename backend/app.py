from flask import Flask, request, jsonify
import json
from ortools.constraint_solver import routing_enums_pb2
from ortools.constraint_solver import pywrapcp

app = Flask(__name__)
devices = {}

@app.route('/update', methods=['POST'])
def update_device():
    data = request.json
    device_id = f"{data['lat']}_{data['lon']}"
    devices[device_id] = data
    return jsonify({"status": "Updated", "data": data}), 200

@app.route('/get_fleet_status', methods=['GET'])
def get_fleet_status():
    return jsonify(devices)

def optimize_routes(locations):
    manager = pywrapcp.RoutingIndexManager(len(locations), 1, 0)
    routing = pywrapcp.RoutingModel(manager)

    def distance_callback(from_index, to_index):
        from_node = manager.IndexToNode(from_index)
        to_node = manager.IndexToNode(to_index)
        return int(((locations[from_node][0] - locations[to_node][0])**2 + 
                   (locations[from_node][1] - locations[to_node][1])**2) ** 0.5 * 1000)

    transit_callback_index = routing.RegisterTransitCallback(distance_callback)
    routing.SetArcCostEvaluatorOfAllVehicles(transit_callback_index)

    search_parameters = pywrapcp.DefaultRoutingSearchParameters()
    search_parameters.first_solution_strategy = routing_enums_pb2.FirstSolutionStrategy.PATH_CHEAPEST_ARC

    assignment = routing.SolveWithParameters(search_parameters)
    if assignment:
        return [manager.IndexToNode(routing.IndexToNode(i)) for i in range(routing.Size())]
    return []

@app.route('/get_optimized_routes', methods=['GET'])
def get_optimized_routes():
    locations = [(d['lat'], d['lon']) for d in devices.values()]
    optimized_route = optimize_routes(locations)
    return jsonify({"route": optimized_route})

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000, debug=True)
