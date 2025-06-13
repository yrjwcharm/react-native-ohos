#include "RNOH/PackageProvider.h"
#include "SvgaPlayerPackage.h"

using namespace rnoh;

std::vector<std::shared_ptr<Package>> PackageProvider::getPackages(Package::Context ctx) {
    return {
         std::make_shared<SvgaPlayerPackage>(ctx),
    };
}